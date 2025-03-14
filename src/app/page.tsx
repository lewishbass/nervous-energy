
export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="h-screen relative bg2 tc2">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <h1 className="text-4xl md:text-6xl font-bold text-center flex flex-col items-center space-y-4">
            <div className='p-8 rounded-4xl tout' style={{backgroundColor: 'var(--khr)'}}>Welcome to My Portfolio</div>
            <div className='p-8 rounded-4xl tout' style={{backgroundColor: 'var(--kho)'}}>Made From Scratch</div>
            <div className='p-8 rounded-4xl tout' style={{backgroundColor: 'var(--khy)'}}>Using Next.js</div>
            
          </h1>
        </div>
      </section>

      {/* About Section */}
      <section className="min-h-screen relative p-6 bg3 tc1">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About Me</h2>
          <p className="text-lg leading-relaxed">
            Your introduction text here...
          </p>
        </div>
      </section>
    </div>
  );
}