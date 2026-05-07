import { useEffect, useState } from "react"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "../services/firebase"
import { products as baseProducts } from "../services/products"

function Admin() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminProducts, setAdminProducts] = useState([])

  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
    image: "",
    active: true,
  })

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem("adminProducts")) || []
    const deletedProducts = JSON.parse(localStorage.getItem("deletedProducts")) || []

    const savedIds = savedProducts.map((p) => p.id)

    const mergedProducts = [
      ...baseProducts.filter(
        (product) =>
          !deletedProducts.includes(product.id) &&
          !savedIds.includes(product.id)
      ),
      ...savedProducts.filter((product) => !deletedProducts.includes(product.id)),
    ]

    setAdminProducts(mergedProducts)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) loadProducts()
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      alert("Error en autenticación")
      console.error(error)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      price: "",
      category: "",
      image: "",
      active: true,
    })
  }

  const handleSaveProduct = (e) => {
    e.preventDefault()

    if (!form.name || !form.price || !form.category) {
      alert("Completa nombre, precio y categoría")
      return
    }

    const savedProducts = JSON.parse(localStorage.getItem("adminProducts")) || []

    const productToSave = {
      id: form.id || Date.now(),
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image: form.image,
      active: form.active,
    }

    const exists = savedProducts.some((product) => product.id === productToSave.id)

    const updatedProducts = exists
      ? savedProducts.map((product) =>
          product.id === productToSave.id ? productToSave : product
        )
      : [...savedProducts, productToSave]

    localStorage.setItem("adminProducts", JSON.stringify(updatedProducts))

    resetForm()
    loadProducts()
  }

  const handleEditProduct = (product) => {
    setForm({
      id: product.id,
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || "",
      active: product.active !== false,
    })

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDeleteProduct = (id) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este producto?")
    if (!confirmDelete) return

    const savedProducts = JSON.parse(localStorage.getItem("adminProducts")) || []
    const deletedProducts = JSON.parse(localStorage.getItem("deletedProducts")) || []

    const productIsFromJson = baseProducts.some((product) => product.id === id)

    if (productIsFromJson) {
      localStorage.setItem(
        "deletedProducts",
        JSON.stringify([...deletedProducts, id])
      )
    } else {
      localStorage.setItem(
        "adminProducts",
        JSON.stringify(savedProducts.filter((product) => product.id !== id))
      )
    }

    loadProducts()
  }

  const handleToggleProduct = (product) => {
    const savedProducts = JSON.parse(localStorage.getItem("adminProducts")) || []

    const updatedProduct = {
      ...product,
      active: !product.active,
    }

    const existsInSaved = savedProducts.some((item) => item.id === product.id)

    const newSavedProducts = existsInSaved
      ? savedProducts.map((item) =>
          item.id === product.id ? updatedProduct : item
        )
      : [...savedProducts, updatedProduct]

    localStorage.setItem("adminProducts", JSON.stringify(newSavedProducts))
    loadProducts()
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <form
          onSubmit={handleLogin}
          className="bg-white border rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-black mb-6 text-center">
            Admin Shinny Woman 💄
          </h1>

          <input
            type="email"
            placeholder="Correo"
            className="border p-3 rounded w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="border p-3 rounded w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="bg-black text-white p-3 rounded w-full font-bold">
            Ingresar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black">Panel Admin Shinny Woman 💄</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-3 rounded-xl font-bold"
        >
          Cerrar sesión
        </button>
      </div>

      <section className="bg-white border rounded-2xl shadow p-6 mb-8">
        <h2 className="text-2xl font-black mb-5">
          {form.id ? "Editar producto" : "Crear producto"}
        </h2>

        <form onSubmit={handleSaveProduct} className="grid gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="border p-3 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Precio"
            className="border p-3 rounded"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="text"
            placeholder="Categoría"
            className="border p-3 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            type="text"
            placeholder="URL de imagen"
            className="border p-3 rounded"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <button className="bg-black text-white p-3 rounded font-bold">
            {form.id ? "Guardar cambios" : "Crear producto"}
          </button>

          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-black p-3 rounded font-bold"
            >
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="bg-white border rounded-2xl shadow p-6">
        <h2 className="text-2xl font-black mb-5">
          Productos ({adminProducts.length})
        </h2>

        <div className="grid gap-4">
          {adminProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-center justify-between"
            >
              <div>
                <h3 className="font-black text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="font-bold">
                  ${Number(product.price || 0).toLocaleString("es-CO")}
                </p>
                <p
                  className={
                    product.active ? "text-green-600 font-bold" : "text-red-600 font-bold"
                  }
                >
                  {product.active ? "Activo" : "Oculto"}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleToggleProduct(product)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded font-bold"
                >
                  {product.active ? "Ocultar" : "Activar"}
                </button>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded font-bold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Admin