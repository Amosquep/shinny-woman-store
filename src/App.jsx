import { useEffect, useMemo, useState } from "react"
import { products } from "./services/products"
import ProductCard from "./components/ProductCard"

function App() {
  const [storeProducts, setStoreProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  useEffect(() => {
    const savedProducts =
      JSON.parse(localStorage.getItem("adminProducts")) || []

    const deletedProducts =
      JSON.parse(localStorage.getItem("deletedProducts")) || []

    const savedIds = savedProducts.map((p) => p.id)

    const mergedProducts = [
      ...products.filter(
        (product) =>
          !deletedProducts.includes(product.id) &&
          !savedIds.includes(product.id)
      ),
      ...savedProducts.filter(
        (product) => !deletedProducts.includes(product.id)
      ),
    ]

    setStoreProducts(mergedProducts.filter((p) => p.active !== false))

    const savedCart = JSON.parse(localStorage.getItem("cart")) || []
    setCart(savedCart)
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

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  )

  const hasDiscount = cart.length >= 7
  const discount = hasDiscount ? total * 0.1 : 0
  const finalTotal = total - discount

  const categories = useMemo(() => {
    const unique = [
      ...new Set(storeProducts.map((p) => p.category).filter(Boolean)),
    ]

    return ["Todos", ...unique]
  }, [storeProducts])

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        selectedCategory === "Todos" ||
        product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [storeProducts, search, selectedCategory])

  const sendToWhatsApp = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío")
      return
    }

    const phone = "573012555262"

    const productsText = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} - $${Number(
            item.price || 0
          ).toLocaleString("es-CO")}`
      )
      .join("\n")

    const message = `Hola Shinny Woman 💄, quiero hacer este pedido:

${productsText}

Productos: ${cart.length}
Subtotal: $${total.toLocaleString("es-CO")}
Descuento: $${discount.toLocaleString("es-CO")}
Total final: $${finalTotal.toLocaleString("es-CO")}

Mi nombre:
Mi dirección:
Mi ciudad:
Método de pago:`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black">
            Shinny <span className="text-amber-700">Woman</span>
          </h1>

          <div className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
            🛒 {cart.length}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <section className="bg-gradient-to-br from-black to-amber-900 text-white rounded-3xl p-6 sm:p-10 mb-6 shadow-xl">
          <p className="uppercase tracking-[4px] text-xs text-amber-300 mb-3">
            maquillaje & bienestar
          </p>

          <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-4 max-w-2xl">
            Belleza premium para brillar todos los días
          </h2>

          <p className="text-sm sm:text-lg text-neutral-200 max-w-xl">
            Compra tus favoritos, arma tu carrito y finaliza tu pedido por
            WhatsApp de forma rápida y personalizada.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold">
              10% OFF desde 7 productos
            </div>

            <div className="border border-amber-500 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
              Pagos: Nequi · Bancolombia · Llave
            </div>
          </div>
        </section>

        <section className="bg-white border rounded-3xl p-4 mb-6 shadow-sm">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-2xl px-4 py-3 outline-none mb-4"
          />

          <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-neutral-100 hover:bg-neutral-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white border rounded-3xl p-4 sm:p-6 mb-6 shadow-sm">
          <h2 className="text-2xl font-black mb-4">
            Carrito ({cart.length})
          </h2>

          {cart.length === 0 ? (
            <p className="text-neutral-500">Tu carrito está vacío.</p>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 border-b pb-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold line-clamp-1">
                        {item.name}
                      </p>

                      <p className="text-sm text-neutral-500">
                        ${Number(item.price || 0).toLocaleString("es-CO")}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 text-sm font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-5">
                <p>
                  Subtotal: $
                  {total.toLocaleString("es-CO")}
                </p>

                {hasDiscount && (
                  <p className="text-green-600 font-bold">
                    Descuento: -$
                    {discount.toLocaleString("es-CO")}
                  </p>
                )}

                <p className="text-2xl font-black">
                  Total: $
                  {finalTotal.toLocaleString("es-CO")}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={sendToWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold transition"
                >
                  Finalizar pedido por WhatsApp
                </button>

                <button
                  onClick={() => setCart([])}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-bold transition"
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </section>

        <section>
          <div className="w-full max-w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App