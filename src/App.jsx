import { useState, useEffect } from "react"
import { products } from "./services/products"
import ProductCard from "./components/ProductCard"

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [storeProducts, setStoreProducts] = useState([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")

  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts")
    const adminProducts = savedProducts ? JSON.parse(savedProducts) : []

    setStoreProducts([...products, ...adminProducts].filter((p) => p.active))
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart((currentCart) => [...currentCart, product])
  }

  const removeFromCart = (indexToRemove) => {
    setCart((currentCart) =>
      currentCart.filter((_, index) => index !== indexToRemove)
    )
  }

  const categories = [
    "todos",
    ...new Set(storeProducts.map((product) => product.category)),
  ]

  const filteredProducts = storeProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === "todos" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const hasDiscount = cart.length > 6
  const discount = hasDiscount ? total * 0.1 : 0
  const finalTotal = total - discount

  const sendToWhatsApp = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío")
      return
    }

    const phone = "573012555262"

    const productsText = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} - $${item.price.toLocaleString()}`
      )
      .join("\n")

    const message = `Hola Shinny Woman 💄, quiero hacer este pedido:

${productsText}

Productos: ${cart.length}
Subtotal: $${total.toLocaleString()}
Descuento: $${discount.toLocaleString()}
Total final: $${finalTotal.toLocaleString()}

Mi nombre:
Mi dirección:
Mi ciudad:
Método de pago:
`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
   <div className="min-h-screen bg-neutral-50 px-3 py-4 sm:px-6">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight">
            Shinny <span className="text-yellow-700">Woman</span>
          </h1>

          <div className="bg-neutral-950 text-white rounded-full px-4 py-2 text-sm">
            🛒 {cart.length}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-neutral-950 text-white px-8 py-16 mb-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-neutral-900 to-yellow-900 opacity-90" />
          <div className="relative max-w-2xl">
            <p className="uppercase tracking-[0.35em] text-yellow-300 text-sm mb-4">
              maquillaje & bienestar
            </p>

            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              Belleza premium para brillar todos los días
            </h2>

            <p className="mt-5 text-lg text-white/80">
              Compra tus favoritos, arma tu carrito y finaliza tu pedido por
              WhatsApp de forma rápida y personalizada.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="bg-white text-black px-5 py-3 rounded-full font-bold">
                10% OFF desde 7 productos
              </span>
              <span className="border border-yellow-300 text-yellow-200 px-5 py-3 rounded-full">
                Pagos: Nequi · Bancolombia · Llave
              </span>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div>
            <div className="bg-white/75 backdrop-blur rounded-3xl p-5 mb-8 shadow-sm border border-yellow-100">
              <input
                type="text"
                placeholder="Buscar producto..."
                className="w-full border border-yellow-200 rounded-full px-5 py-3 mb-4 outline-none focus:ring-2 focus:ring-yellow-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full capitalize whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-neutral-950 text-white"
                        : "bg-yellow-50 text-neutral-700 hover:bg-yellow-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>

          <aside className="bg-white/85 backdrop-blur rounded-3xl p-6 shadow-xl border border-yellow-100 h-fit sticky top-24">
            <h2 className="text-2xl font-black mb-4">Tu carrito</h2>

            {cart.length === 0 ? (
              <p className="text-neutral-500">Tu carrito está vacío.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between gap-3 border-b border-yellow-100 pb-3"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-yellow-700">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 text-sm font-bold"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  <p>Productos: {cart.length}</p>
                  <p>Subtotal: ${total.toLocaleString()}</p>

                  {hasDiscount && (
                    <p className="text-green-600 font-bold">
                      Descuento 10%: -${discount.toLocaleString()}
                    </p>
                  )}

                  <p className="text-2xl font-black">
                    Total: ${finalTotal.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={sendToWhatsApp}
                  className="mt-5 w-full rounded-full bg-green-600 text-white py-4 font-black hover:bg-green-700 transition"
                >
                  Enviar pedido por WhatsApp
                </button>

                <button
                  onClick={() => setCart([])}
                  className="mt-3 w-full rounded-full bg-red-50 text-red-600 py-3 font-bold hover:bg-red-100 transition"
                >
                  Vaciar carrito
                </button>
              </>
            )}
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
