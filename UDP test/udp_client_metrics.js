const s = require('dgram').createSocket('udp4')
//const b = Buffer.alloc(1)

var buffer = new Buffer.alloc(100);

var recv_count = 0
var sent_count = 0
var last_sent = 0
var last_loss =0

var PORT = 33333;
var HOST = '127.0.0.1';

//s.bind(33333)

s.on("message", (msg, rinfo)=> {
    recv_count++
})

/*function doSend(){
    //for (let i = 0; i < 8; i++){
        sent_count++;

        s.send(buffer, PORT, HOST);
    //}
    //simluate fill buffer in real usage
    //Also let the recvhandler and timer have chance to print out
    setImmediate(()=>{doSend()})   
}*/

function doSend() {
    setInterval(()=> {    
        s.send(buffer, PORT, HOST, function(error)
        {
            if(error)
            {
                s.close();
            }
            else
            {
                sent_count++;
    
                console.log("Paquetes enviados al servidor: %d, Paquetes recibidos del servidor: %d, send rate %d package/sec, loss rate% %d ",
                sent_count,
                recv_count,
                sent_count-last_sent,
                ((sent_count-recv_count-last_loss)*100/(sent_count-last_sent)).toFixed(3))

                console.log("");

                last_sent = sent_count
                last_loss = sent_count-recv_count
            }
        });
    }, 1000)
}

/*function doSendInCallback(){
    sent_count++
    s.send(b, 1234,()=>{doSendInCallback()})
}*/

/*setInterval(()=>{
    console.log("GAP>%d,GAP Increased %d, total s:%d, r:%d,send rate %d package/sec,loss rate% %d ",sent_count-recv_count,
                                                               sent_count-recv_count-last_loss,
                                                                sent_count,
                                                                recv_count,
                                                                sent_count-last_sent,
                                                                ((sent_count-recv_count-last_loss)*100/(sent_count-last_sent)).toFixed(3))
    last_sent = sent_count
    last_loss = sent_count-recv_count
},1000)*/

/*setInterval(()=>{
    console.log("Paquetes enviados al servidor: %d, Paquetes recibidos del servidor: %d, send rate %d package/sec, loss rate% %d ",
                                                                sent_count,
                                                                recv_count,
                                                                sent_count-last_sent,
                                                                ((sent_count-recv_count-last_loss)*100/(sent_count-last_sent)).toFixed(3))
    last_sent = sent_count
    last_loss = sent_count-recv_count
},1000);*/

doSend()
//to compare with 
//doSendInCallback()