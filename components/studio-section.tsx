export function StudioSection() {
  return (
    <section className="py-32 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl lg:text-6xl font-light text-zinc-900 mb-8">Our Studio</h2>
            <div className="space-y-6 text-lg font-light text-zinc-600 leading-relaxed">
              <p>
                Founded on the principles of effectuality, integrity, efficiency, and coexistence, Office of Native
                Architects bridges the gap between traditional wisdom and contemporary design.
              </p>
              <p>
                Our multidisciplinary team brings together architects, planners, and cultural consultants who share a
                commitment to creating spaces that honor the past while embracing the future.
              </p>
              <p>
                We believe that architecture has the power to heal, connect, and inspire communities while respecting
                the natural environment and cultural heritage.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-zinc-200 rounded-sm overflow-hidden">
              <img src="/placeholder.svg?height=600&width=600" alt="Studio" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-zinc-900 rounded-sm"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
