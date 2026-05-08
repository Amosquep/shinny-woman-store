import { useEffect, useMemo, useState } from "react"
import { products } from "./services/products"
import ProductCard from "./components/ProductCard"

function App() {
  const [storeProducts, setStoreProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartBump, setCartBump] = useState(false)

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
    setCartBump(true)

    setTimeout(() => {
      setCartBump(false)
    }, 450)
  }

  const removeFromCart = (indexToRemove) => {
    setCart((currentCart) =>
      currentCart.filter((_, index) => index !== indexToRemove)
    )
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0)
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
    const cleanSearch = search.toLowerCase().trim()

    return storeProducts.filter((product) => {
      const name = product.name?.toLowerCase() || ""
      const category = product.category?.toLowerCase() || ""
      const description = product.description?.toLowerCase() || ""

      const matchesSearch =
        name.includes(cleanSearch) ||
        category.includes(cleanSearch) ||
        description.includes(cleanSearch)

      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory

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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f3e5cf] pt-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f3e5cf]/95 backdrop-blur border-b border-[#d6b98c]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black text-[#4b2e16]">
            Shinny <span className="text-[#b8860b]">Woman</span>
          </h1>

          <button
            onClick={() => {
              document
                .getElementById("cart-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`bg-[#c9a227] text-white px-4 py-2 rounded-full font-bold text-sm shadow hover:bg-[#b48c18] transition ${cartBump ? "scale-125 animate-bounce" : "scale-100"
              }`}
          >
            🛒 {cart.length}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <section className="bg-gradient-to-br from-[#4b2e16] to-[#b8860b] text-white rounded-3xl p-6 sm:p-10 mb-6 shadow-xl">
          <p className="uppercase tracking-[4px] text-xs text-[#f8e6a0] mb-3">
            maquillaje & bienestar
          </p>

          <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-4 max-w-2xl">
            Belleza premium para brillar todos los días
          </h2>

          <p className="text-sm sm:text-lg text-[#fff8e8] max-w-xl">
            Compra tus favoritos, arma tu carrito y finaliza tu pedido por
            WhatsApp de forma rápida y personalizada.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-white text-[#4b2e16] px-4 py-2 rounded-full text-sm font-bold">
              10% OFF desde 7 productos
            </div>

            <div className="border border-[#f8e6a0] text-[#f8e6a0] px-4 py-2 rounded-full text-sm font-semibold">
              Pagos: Nequi · Bancolombia · Llave
            </div>
          </div>
        </section>

        <section className="sticky top-[72px] z-40 bg-[#fffaf2]/95 backdrop-blur border border-[#e6d6bd] rounded-3xl p-4 mb-6 shadow-sm">
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Buscar maquillaje, labial, crema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#e6d6bd] rounded-2xl pl-11 pr-24 py-4 outline-none text-base bg-white focus:border-[#b8860b]"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold bg-[#c9a227] text-white px-3 py-2 rounded-full"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-sm text-[#6b4a25]">
              {filteredProducts.length} producto
              {filteredProducts.length !== 1 ? "s" : ""} encontrado
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>

            {search && (
              <p className="text-xs bg-[#f8e6a0] text-[#6b4a25] px-3 py-1 rounded-full font-bold">
                “{search}”
              </p>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition ${selectedCategory === category
                  ? "bg-[#c9a227] text-white"
                  : "bg-[#f8f0e4] text-[#4b2e16] hover:bg-[#ead9bd]"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section
          id="cart-section"
          className="bg-[#fffaf2] border border-[#e6d6bd] rounded-3xl p-4 sm:p-6 mb-6 shadow-sm"
        >
          <h2 className="text-2xl font-black mb-4 text-[#4b2e16]">
            Carrito ({cart.length})
          </h2>

          {cart.length === 0 ? (
            <p className="text-[#6b4a25]">Tu carrito está vacío.</p>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 border-b border-[#e6d6bd] pb-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold line-clamp-1 text-[#4b2e16]">
                        {item.name}
                      </p>

                      <p className="text-sm text-[#6b4a25]">
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

              <div className="space-y-2 mb-5 text-[#4b2e16]">
                <p>Subtotal: ${total.toLocaleString("es-CO")}</p>

                {hasDiscount && (
                  <p className="text-green-600 font-bold">
                    Descuento: -${discount.toLocaleString("es-CO")}
                  </p>
                )}

                <p className="text-2xl font-black">
                  Total: ${finalTotal.toLocaleString("es-CO")}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={sendToWhatsApp}
                  className="w-full bg-[#c9a227] hover:bg-[#b48c18] text-white py-4 rounded-2xl font-bold transition"
                >
                  Finalizar pedido por WhatsApp
                </button>

                <button
                  onClick={() => setCart([])}
                  className="w-full bg-[#4b2e16] hover:bg-[#321f0f] text-white py-3 rounded-2xl font-bold transition"
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
                onViewProduct={setSelectedProduct}
              />
            ))}
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#f8f0e4] rounded-3xl max-w-md w-full p-4 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-[#c9a227] text-white w-9 h-9 rounded-full font-black"
            >
              ×
            </button>

            <img
              src={
                selectedProduct.image ||
                `/product-images/page-${String(
                  (selectedProduct.id % 100) + 2
                ).padStart(3, "0")}.jpg`
              }
              alt={selectedProduct.name}
              className="w-full max-h-[70vh] object-contain rounded-2xl bg-white"
            />

            <h2 className="text-xl font-black mt-4 text-[#4b2e16]">
              {selectedProduct.name}
            </h2>

            <p className="text-2xl font-black text-[#b8860b] mt-2">
              ${Number(selectedProduct.price || 0).toLocaleString("es-CO")}
            </p>

            <button
              onClick={() => {
                addToCart(selectedProduct)
                setSelectedProduct(null)
              }}
              className="w-full mt-4 bg-[#c9a227] hover:bg-[#b48c18] text-white py-3 rounded-2xl font-bold"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App