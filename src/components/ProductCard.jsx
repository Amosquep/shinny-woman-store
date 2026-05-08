function ProductCard({ product, addToCart }) {
  return (
    <div className="w-full max-w-full overflow-hidden bg-white rounded-2xl shadow-md border p-3">
      <img
        src={
          product.image ||
          `/product-images/page-${String((product.id % 100) + 2).padStart(3, "0")}.jpg`
        }
        alt={product.name}
        className="block mx-auto w-full max-w-full h-[220px] object-contain object-center bg-white rounded-xl"
      />

      <div className="p-3">
        <p className="text-[10px] uppercase tracking-widest text-amber-700 mb-2">
          {product.category}
        </p>

        <h3 className="text-base font-black mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-2xl font-black mb-4">
          ${Number(product.price || 0).toLocaleString("es-CO")}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard