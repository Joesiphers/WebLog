//const dbUrl=mongodb+srv://zhouwg:ccciiiooo@cluster0.vzwzd.mongodb.net/products?retryWrites=true&w=majority;
const MongoClient = require('mongodb').MongoClient;
             
const createProducts= async (req,res,next)=>{
    const uri = "mongodb+srv://zhouwg:ccciiiooo@cluster0.vzwzd.mongodb.net/productTest?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const newProducts={
        name:req.body.name, 
        price:req.body.price
    };
    try {
        //console.log('connecting DB');
        await client.connect();
        //console.log('connected successfully');
        await client.db().collection("devices").insertOne(newProducts);
        //每次去操作数据库都要加上await。
        res.status(200).send(`success added ${newProducts} `)
} 
    catch (error){return res.json(error)};
    client.close();
};
 
exports.createProducts=createProducts;
const getProducts = async (req,res,next)=>{
    const uri = "mongodb+srv://zhouwg:ccciiiooo@cluster0.vzwzd.mongodb.net/productTest?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try{
        console.log('connecting DB');
        await client.connect();
        console.log('connected successfully');
        let products = await client.db().collection('devices').find().toArray();
        console.log(products);
        res.status(200).json(products)
    }
    catch (error){
        return res.status(201).json({message:products})
    };
    client.close()
};
exports.getProducts= getProducts;
