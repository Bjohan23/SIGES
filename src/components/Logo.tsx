// components/Logo.tsx
// Single Responsibility: Logo y título de la aplicación

export default function Logo() {
  return (
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-10 h-10 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          ></path>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-600">
        Sistema de Gestión Social
      </h1>
      <p className="text-gray-600 text-sm mt-2">
         Nicolas La Torre García, &quot; Chiclayo&quot;
      </p>
    </div>
  )
}
