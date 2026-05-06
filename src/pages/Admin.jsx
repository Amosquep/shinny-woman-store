import { useEffect, useState } from "react"
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"

import axios from "axios"

import { auth } from "../services/firebase"

function Admin() {
  // LOGIN
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  // PRODUCTOS
  const [adminProducts, setAdminProducts] = useState([])

  // FORMULARIO
  const [editingId, setEditingId] = useState(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState(null)

  // SESIÓN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  // CARGAR PRODUCTOS
  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts")

    setAdminProducts(
      savedProducts ? JSON.parse(savedProducts) : []
    )
  }, [])

  // GUARDAR PRODUCTOS
  const saveProducts = (newProducts) => {
    setAdminProducts(newProducts)

    localStorage.setItem(
      "adminProducts",
      JSON.stringify(newProducts)
    )
  }

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
    } catch (error) {
      alert(`${error.code}: ${error.message}`)
    }
  }

  // LOGOUT
  const handleLogout = async () => {
    await signOut(auth)
  }

  // SUBIR IMAGEN CLOUDINARY
  const uploadImage = async () => {
    if (!image) return null

    const formData = new FormData()

    formData.append("file", image)
    formData.append("upload_preset", "shinnywoman")

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/du8ctefkm/image/upload",
      formData
    )

    return response.data.secure_url
  }

  // LIMPIAR FORM
  const resetForm = () => {
    setName("")
    setPrice("")
    setCategory("")
    setImage(null)
    setEditingId(null)
  }

  // CREAR / EDITAR PRODUCTO
  const handleSubmitProduct = async (e) => {
    e.preventDefault()

    if (!name || !price || !category) {
      alert("Completa todos los campos")
      return
    }

    try {
      const imageUrl = await uploadImage()

      // EDITAR
      if (editingId) {
        const updatedProducts = adminProducts.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name,
                price: Number(price),
                category,
                image: imageUrl || product.image,
              }
            : product
        )

        saveProducts(updatedProducts)

        alert("Producto actualizado ✅")

        resetForm()

        return
      }

      // CREAR
      if (!image) {
        alert("Selecciona una imagen")
        return
      }

      const newProduct = {
        id: Date.now(),
        name,
        price: Number(price),
        category,
        image: imageUrl,
        active: true,
      }

      saveProducts([
        ...adminProducts,
        newProduct,
      ])

      alert("Producto creado ✅")

      resetForm()

    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  // EDITAR
  const handleEdit = (product) => {
    setEditingId(product.id)

    setName(product.name)
    setPrice(product.price)
    setCategory(product.category)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ACTIVAR / DESACTIVAR
  const toggleActive = (id) => {
    const updatedProducts = adminProducts.map((product) =>
      product.id === id
        ? {
            ...product,
            active: !product.active,
          }
        : product
    )

    saveProducts(updatedProducts)
  }

  // ELIMINAR
  const deleteProduct = (id) => {
    const confirmDelete = confirm(
      "¿Eliminar producto?"
    )

    if (!confirmDelete) return

    const updatedProducts =
      adminProducts.filter(
        (product) => product.id !== id
      )

    saveProducts(updatedProducts)
  }

  // DASHBOARD ADMIN
  if (user) {
    return (
      <div className="min-h-screen bg-[#f8f1e8] p-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black">
              Panel Admin Shinny Woman 💄
            </h1>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-3 rounded-full font-bold"
            >
              Cerrar sesión
            </button>
          </div>

          {/* FORMULARIO */}
          <form
            onSubmit={handleSubmitProduct}
            className="bg-white rounded-3xl p-6 shadow-xl border border-yellow-100 mb-10"
          >
            <h2 className="text-2xl font-black mb-5">
              {editingId
                ? "Editar producto"
                : "Crear producto"}
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              <input
                type="text"
                placeholder="Nombre"
                className="border p-3 rounded-xl"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Precio"
                className="border p-3 rounded-xl"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Categoría"
                className="border p-3 rounded-xl"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              />

            </div>

            <div className="mt-4">

              <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files[0])
                }
              />

            </div>

            <div className="flex gap-3 mt-5">

              <button className="bg-black text-white px-6 py-3 rounded-full font-bold">
                {editingId
                  ? "Guardar cambios"
                  : "Crear producto"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-neutral-200 px-6 py-3 rounded-full font-bold"
                >
                  Cancelar
                </button>
              )}

            </div>
          </form>

          {/* PRODUCTOS */}
          <section>

            <h2 className="text-2xl font-black mb-5">
              Productos ({adminProducts.length})
            </h2>

            {adminProducts.length === 0 ? (
              <p>No hay productos creados.</p>
            ) : (

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                {adminProducts.map((product) => (

                  <div
                    key={product.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-yellow-100"
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-52 object-cover"
                    />

                    <div className="p-5">

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.active
                          ? "Activo"
                          : "Inactivo"}
                      </span>

                      <h3 className="text-xl font-black mt-3">
                        {product.name}
                      </h3>

                      <p className="text-yellow-700">
                        {product.category}
                      </p>

                      <p className="text-2xl font-black mt-2">
                        $
                        {product.price.toLocaleString()}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-5">

                        <button
                          onClick={() =>
                            handleEdit(product)
                          }
                          className="bg-yellow-600 text-white py-2 rounded-full font-bold"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            toggleActive(product.id)
                          }
                          className="bg-neutral-900 text-white py-2 rounded-full font-bold"
                        >
                          {product.active
                            ? "Ocultar"
                            : "Activar"}
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(product.id)
                          }
                          className="col-span-2 bg-red-500 text-white py-2 rounded-full font-bold"
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>
      </div>
    )
  }

  // LOGIN SCREEN
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f1e8]">

      <form
        onSubmit={handleLogin}
        className="bg-white border p-6 rounded-3xl shadow-xl w-96"
      >

        <h1 className="text-2xl font-black mb-4 text-center">
          Admin Shinny Woman
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="border w-full p-3 mb-3 rounded-xl"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border w-full p-3 mb-3 rounded-xl"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className="bg-black text-white w-full py-3 rounded-full font-bold">
          Ingresar
        </button>

      </form>

    </div>
  )
}

export default Admin