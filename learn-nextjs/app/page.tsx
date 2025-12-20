import Link from 'next/link'

const HomePage = () => {
  return (
    <div className="mt-[-200px] flex min-h-screen flex-col items-center justify-center">
      <div className="text-4xl font-bold">Home Page</div>

      <div className="mt-10">
        <Link href="/about" className="text-blue-500">
          Go to About Page
        </Link>
      </div>
    </div>
  )
}

export default HomePage
