function ProductCard({ product, addToCart }) {
  return (
    <div className="w-full min-w-0 overflow-hidden bg-white rounded-2xl shadow-md border p-3">
      <div className="w-full overflow-hidden rounded-xl bg-white flex items-center justify-center">
        <img
          src={
            product.image ||
            `/product-images/page-${String((product.id % 100) + 2).padStart(3, "0")}.jpg`
          }
          alt={product.name}
          className="w-full h-[170px] object-contain object-center"
        />
      </div>

      <div className="p-2">
        <p className="text-[10px] uppercase tracking-widest text-amber-700 mb-2">
          {product.category}
        </p>

        <h3 className="text-base font-black mb-2 break-words leading-tight">
          {product.name}
        </h3>

        <p className="text-2xl font-black mb-4">
          ${Number(product.price || 0).toLocaleString("es-CO")}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-neutral-800 transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard