/* global mqtt, ansi_up */

const master = mqtt.connect('https://master.tortops.com', {'protocol': 'wss'});
const ansiup = new AnsiUp();
export class ServerDashboard {

    constructor() {
        master.subscribe('server');
        master.subscribe('serverlist');
        master.subscribe('stdout');
        master.on('message', this.onmessage.bind(this));
        this.tempserverData = {};
        $('#server-dashboard').empty();
        this.monitors = {};
    }

    onmessage(topic, message) {
        const data = JSON.parse(message.toString());
        switch (topic) {
            case 'serverlist':
                console.log(data);
                if (data.connected) {
                    for (let serverId in data.connected) {
                        const serverPayload = data.connected[serverId];
                        this.monitors[serverId] = new ServerMonitor(this, serverId, serverPayload.serverData, serverPayload.status);
                    }
                }
                if (data.disconnect) {
                    this.monitors[data.disconnect].destroy();
                    delete this.monitors[data.disconnect];
                }
                break;
            case 'server':
                if (this.monitors[data.id]) {
                    this.monitors[data.id].updateStatus(data);
                }
                break;
            case 'stdout':
                if (this.monitors[data.id]) {
                    this.monitors[data.id].stdout(data.data);
                }
                break;
        }
    }
}

class ServerMonitor {
    constructor(dashboard, serverId, serverData, statusData) {
        this.dashboard = dashboard;
        this.sid = serverId;
        this.id = serverData.server_id;
        this.name = serverData.server_name;
        this.address = serverData.address;
        this.domain = serverData.domain;
        this.terminalLines = [];
        this.terminalPaused = false;
        this.servicePanels = {};
        this.repositoryPanels = {
            'backend': new RepositoryPanel(this, 'backend'),
            'frontend': new RepositoryPanel(this, 'frontend')
        };
        console.log(statusData);
        if (statusData) {
            this.updateStatus(statusData);
        }
        this.render();
    }
    destroy() {
        this.div.remove();
    }

    render() {
        let control;
        this.div = $('<div>').addClass('card service-monitor').appendTo('#server-dashboard');
        this.div[0].dataset.serverId = this.id;

        const toSort = Array.prototype.slice.call(document.getElementsByClassName('service-monitor'), 0);
        toSort.sort(function (a, b) {
            return a.dataset.serverId.localeCompare(b.dataset.serverId);
        });
        $('service-monitor').detach();
        for (const smdiv of toSort) {
            $('#server-dashboard').append(smdiv);
        }

        this.header = $('<div>').addClass('card-header').appendTo(this.div);
        this.header.html('<i class="fad fa-server"></i> ' + this.name + ' - ' + this.domain + ' - ' + this.address + '<span class="float-right">' + this.id + '</span>');
        this.body = $('<div>').addClass('card-body row').appendTo(this.div);
        this.servicesDiv = $('<div>').addClass('services-div col-4').appendTo(this.body);

        this.terminal = $('<div>').addClass('terminal-div col-8').appendTo(this.body);


        this.clearTerminal = $('<button>').html('<i class="fad fa-times-square"></i>').addClass('btn btn-sm clear-terminal-button float-right sticky-top').appendTo(this.terminal);
        this.clearTerminal.click(() => {
            for (const terminalLine of this.terminalLines) {
                terminalLine.remove();
            }
            this.terminalLines = [];
        });

        this.pauseTerminal = $('<button>').html('<i class="fad fa-pause"></i>').addClass('btn btn-sm pause-terminal-button float-right sticky-top').appendTo(this.terminal);
        this.pauseTerminal.click(() => {
            this.terminalPaused = !this.terminalPaused;
            if (this.terminalPaused) {
                this.pauseTerminal.addClass('btn-danger');
                this.pauseTerminal.removeClass('btn-default');
            } else {
                this.pauseTerminal.removeClass('btn-danger');
                this.pauseTerminal.addClass('btn-default');
            }
        });
        this.repositoryDiv = $('<div>').addClass('services-div').appendTo(this.body);
        for (let serverName in this.servicePanels) {
            const servicePanel = this.servicePanels[serverName];
            servicePanel.render();
        }
        this.repositoryPanels.backend.render();
        this.repositoryPanels.frontend.render();
        this.rendered = true;
    }

    updateStatus(statusData) {
        const services = statusData.services;
        const repository = statusData.repository;
        this.services = services;
        if (services) {
            for (let service in services) {
                if (!this.servicePanels[service]) {
                    this.servicePanels[service] = new ServicePanel(this, service, services[service]);
                    if (this.rendered) {
                        this.servicePanels[service].render();
                    }
                }
                this.servicePanels[service].updateStatus(services[service]);
            }
        }
        if (repository) {
            if (!this.repositoryPanels['backend']) {
                this.repositoryPanels['backend'] = new RepositoryPanel(this, 'backend', repository.backend);
            }
            this.repositoryPanels['backend'].updateStatus(repository.backend);

            if (!this.repositoryPanels['frontend']) {
                this.repositoryPanels['frontend'] = new RepositoryPanel(this, 'frontend', repository.frontend);
            }
            this.repositoryPanels['frontend'].updateStatus(repository.frontend);
        }
    }
    stdout(data) {
        if (this.terminalPaused) {
            return;
        }
        if (this.terminalLines.length > 64) {
            this.terminalLines.shift().remove();
        }
        const terminalLine = $('<div>').html(ansiup.ansi_to_html(data).replace(/\n/g, "<br />")).appendTo(this.terminal);
        this.terminalLines.push(terminalLine);
        this.terminal[0].scrollTo(0, this.terminal[0].scrollHeight);
    }
    startService(service) {
        master.publish(this.sid, JSON.stringify({[service]: 'start'}));
    }
    stopService(service) {
        master.publish(this.sid, JSON.stringify({[service]: 'stop'}));
    }
    pull(repositoryName) {
        master.publish(this.sid, JSON.stringify({
            [repositoryName]: {
                'action': 'pull'
            }
        }));
    }
    checkout(repositoryName, branch) {
        master.publish(this.sid, JSON.stringify({
            [repositoryName]: {
                'action': 'checkout',
                'branch': branch
            }
        }));
    }

}

class ServicePanel {
    constructor(serverMonitor, serviceName, status) {
        this.serverMonitor = serverMonitor;
        this.serviceName = serviceName;
        this.status = status;

    }
    render() {
        this.div = $('<div>').addClass('card-body').prependTo(this.serverMonitor.servicesDiv);

        this.startButton = $('<button>', {'title': 'start'}).addClass('btn  btn-sm btn-success').append('<i class="fad fa-play-circle"></i>').appendTo(this.div);
        this.startButton.click(() => {
            this.serverMonitor.startService(this.serviceName);
        });
        this.stopButton = $('<button>', {'title': 'stop'}).addClass('btn btn-sm btn-danger').append('<i class="fad fa-octagon"></i>').appendTo(this.div);
        this.stopButton.click(() => {
            console.log('stop');
            this.serverMonitor.stopService(this.serviceName);
        });

        this.div.append(' <span>' + this.serviceName + ':</span> ');
        this.statusSpan = $('<span>').addClass('status-span').appendTo(this.div);

        this.rendered = true;
        this.updateStatus();

    }
    updateStatus(status) {
        this.status = status || this.status;
        if (!this.rendered) {
            return;
        }
        this.statusSpan.html(this.status);
        this.statusSpan.removeClass('text-success text-warning text-muted text-danger');
        switch (this.status) {
            case 'online':
                this.div.show();
                this.startButton.hide();
                this.stopButton.show();
                this.statusSpan.addClass('text-success');
                break;
            case 'stopped':
                this.div.show();
                this.startButton.show();
                this.stopButton.hide();
                this.statusSpan.addClass('text-danger');
                break;
            case 'disabled':
                this.div.hide();
                this.startButton.hide();
                this.stopButton.hide();
                this.statusSpan.addClass('text-muted');
                break;
        }
    }
}


class RepositoryPanel {
    constructor(serverMonitor, repositoryName, branches) {
        this.serverMonitor = serverMonitor;
        this.repositoryName = repositoryName;
        this.branches = branches || {};
        this.updateStatus();

    }
    render() {
        let div;
        this.div = $('<div>').addClass('card-body').appendTo(this.serverMonitor.servicesDiv);
        this.div.append(' <h4><i class="fab fa-git-alt"></i> ' + this.repositoryName + ':</h4> ');
        this.branchSpan = $('<span>').addClass('branch-span').appendTo(this.div);
        this.div.append('<br>');
        this.branchDesc = $('<small>').addClass('branch-span').appendTo(this.div);
        this.div.append('<br>');

        this.dataList = $('<datalist>').attr('id', this.serverMonitor.sid + '-' + this.repositoryName).appendTo(this.div);
        for (let branchName in this.branches) {
            if (branchName.split('/').length < 2) {
                continue;
            }
            $('<option>').attr('value', branchName.split('/').pop()).appendTo(this.dataList);
        }

        this.checkoutGroup = $('<div>').addClass('input-group').appendTo(this.div);
        div = $('<div>').addClass('input-group-prepend').appendTo(this.checkoutGroup);
        this.pullBtn = $('<buttn>', {'title': 'Pull'}).addClass('btn btn-secondary btn-sm').html('<i class="fad fa-download"></i>').appendTo(div);
        this.pullBtn.click(() => {
            this.serverMonitor.pull(this.repositoryName);
        });

        this.checkoutBtn = $('<buttn>', {'title': 'Checkout'}).addClass('btn btn-secondary btn-sm').html('<i class="fad fa-code-branch"></i>').appendTo(div);
        this.checkoutBtn.click(() => {
            this.serverMonitor.checkout(this.repositoryName, this.checkoutInput.val());
        });

        this.checkoutInput = $('<input>', {'type': 'text',
            'list': this.serverMonitor.sid + '-' + this.repositoryName,
            'placeholder': 'branch or commit'})
                .addClass('form-control').appendTo(this.checkoutGroup);



        this.rendered = true;
        this.updateStatus();

    }
    updateStatus(branches) {
        this.branches = branches || this.branches;
        let current = {'name': '-', 'commit': '-'};

        for (let branchName in this.branches) {
            if (this.branches[branchName].current) {
                current = this.branches[branchName];
            }
        }

        if (!this.rendered) {
            return;
        }
        this.dataList.empty();
        for (let branchName in this.branches) {
            if (branchName.split('/').length < 2) {
                continue;
            }
            $('<option>').attr('value', branchName.split('/').pop()).appendTo(this.dataList);
        }
        this.branchSpan.html(current.name + ' - ' + current.commit);
        this.branchDesc.html(current.label);

    }
}