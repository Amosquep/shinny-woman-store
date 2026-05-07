function ProductCard({ product, addToCart }) {
  return (
    <div className="w-full max-w-full overflow-hidden bg-white rounded-2xl shadow-md border">
      <img
        src={
          product.image ||
          `/product-images/page-${String((product.id % 100) + 2).padStart(3, "0")}.jpg`
        }
        alt={product.name}
        className="w-full h-64 object-cover"
      />

      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-amber-700 mb-2">
          {product.category}
        </p>

        <h3 className="text-xl font-black mb-3 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-3xl font-black mb-5">
          ${Number(product.price || 0).toLocaleString("es-CO")}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-black text-white py-3 rounded-2xl font-bold hover:bg-neutral-800 transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard