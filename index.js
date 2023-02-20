const app =require('./app')
const {PORT} = process.env
app.listen(PORT,()=>{
    console.log('SERVER is running at port:${PORt}');
})

app.listen()