const express = require('express');
const path = require('path');
const server = express();
const expressLayouts = require('express-ejs-layouts');


server.set('view engine', 'ejs');
server.use(expressLayouts);
server.use(express.static('public'));

server.get('/', (req, res) => {
    const images = ['customer1.jpg', 'customer2.jpg', 'customer3.jpg', 'customer4.jpg', 'customer5.jpg',
        's1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg',
        's11.jpg', 's12.jpg', 's13.jpg', 's14.jpg', 's15.jpg', 's16.jpg', 's17.jpg', 's18.jpg', 's19.jpg',
        's20.jpg', 's21.jpg', 's22.jpeg', 's23.jpeg', 's24.jpeg', 's25.jpeg', 's26.jpeg', 's27.jpg',
        's28.jpg', 's29.jpg', 's30.jpg', 's31.jpg', 's32.jpg', 's33.jpg', 's34.jpg', 's35.jpg', 's36.jpg',
        's37.jpg', 's38.jpg', 's39.jpg', 's40.jpg', 's41.jpg', 's42.jpg', 's43.jpg', 's44.jpg', 's45.jpg',
        's46.jpg', 's47.jpg', 's48.jpg', 's49.jpg', 's50.jpg', 's51.jpg', 's52.jpg', 's53.jpg', 's54.jpg',
        's55.jpg', 's56.jpg', 's57.jpg', 's58.jpg', 's59.jpeg', 's60.jpeg', 's61.jpeg', 's62.jpeg', 's63.jpg',
        's64.jpg', 's65.jpg', 's66.jpg', 's67.jpg', 's68.jpg', 's69.jpg', 's70.jpg', 's71.jpg', 's72.jpg',
        's73.jpg', 's74.mp4', 's75.jpg', 's76.jpg', 's77.jpg', 's78.jpg', 's79.jpg', 's80.jpg', 's81.jpg',
        's82.jpg', 's83.jpg', 's84.jpg', 's85.jpg', 's86.mp4', 's87.mp4', 's88.jpg', 's89.jpg', 's90.jpg',
        's91.jpg', 's92.jpg', 's93.jpg', 's94.jpg'
    ];

    res.render('index', { images });
});
server.get('/', (req, res) => {
    res.render('index'); 
});

server.get('/about', (req, res) => {
    res.render('about'); 
});

server.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});
