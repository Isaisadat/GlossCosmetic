require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Product model (read-only, simplified)
const productSchema = new mongoose.Schema({
  nombre: String, proveedor: String, cantidad: Number,
  precioCompra: Number, precioVenta: Number, categoria: String,
  material: String, variantes: Array, url: String,
  descripcion: String, color: String, activo: Boolean
}, { collection: 'products' });

const Product = mongoose.model('CatalogProduct', productSchema);

app.get('/api/products', async (req, res) => {
  try {
    const filter = { activo: true };
    const products = await Product.find(filter)
      .select('nombre proveedor cantidad precioVenta categoria material variantes url descripcion color')
      .sort({ nombre: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar productos' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`GLOSS catálogo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error de conexión:', err);
    process.exit(1);
  });
