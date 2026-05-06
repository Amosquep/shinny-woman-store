function ProductCard({ product, addToCart }) {
  return (
    <div className="group bg-white/80 backdrop-blur border border-yellow-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-widest text-yellow-700">
          {product.category}
        </p>

        <h2 className="mt-1 font-bold text-lg text-neutral-900">
          {product.name}
        </h2>

        <p className="text-2xl font-bold mt-2 text-neutral-900">
          ${product.price.toLocaleString()}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full rounded-full bg-neutral-950 text-white py-3 font-semibold hover:bg-yellow-700 transition-all duration-300"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard