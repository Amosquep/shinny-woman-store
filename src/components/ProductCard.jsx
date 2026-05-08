function ProductCard({ product, addToCart, onViewProduct }) {
  return (
    <div className="w-full min-w-0 overflow-hidden bg-white rounded-2xl shadow-md border border-[#e6d6bd] p-3">
      <button
        onClick={() => onViewProduct(product)}
        className="w-full overflow-hidden rounded-xl bg-[#f8f0e4] flex items-center justify-center"
      >
        <img
          src={
            product.image ||
            `/product-images/page-${String((product.id % 100) + 2).padStart(3, "0")}.jpg`
          }
          alt={product.name}
          className="w-full h-[170px] object-contain object-center"
        />
      </button>

      <div className="p-2">
        <p className="text-[10px] uppercase tracking-widest text-[#b8860b] mb-2">
          {product.category}
        </p>

        <h3 className="text-base font-black mb-2 break-words leading-tight">
          {product.name}
        </h3>

        <p className="text-2xl font-black mb-4 text-[#4b2e16]">
          ${Number(product.price || 0).toLocaleString("es-CO")}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-[#c9a227] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#b48c18] transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard