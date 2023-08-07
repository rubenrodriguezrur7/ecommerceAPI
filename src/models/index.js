const Category = require("./Category");
const Product = require('./Product');
const Image = require('./Image');
const Cart = require('./Cart');
const User = require('./User');
const Purchase = require('./Purchase');


Category.hasMany(Product);
Product.belongsTo(Category);

Product.hasMany(Image);
Image.belongsTo(Product);

User.hasMany(Cart);
Cart.belongsTo(User);

Product.hasMany(Cart);
Cart.belongsTo(Product);

Purchase.belongsTo(Product);
Product.hasMany(Purchase);

Purchase.belongsTo(User);
User.hasMany(Purchase);

