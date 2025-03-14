export default function Home() {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 tc1">Welcome Home</h1>
        <div className="grid gap-6">
          <section className="bg2 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 tc1">Featured Content</h2>
            <p className="tc2">
              Welcome to our platform. This is where youll find the latest updates and featured content.
            </p>
          </section>
          
          <section className="bg2 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 tc1">Recent Activity</h2>
            <div className="space-y-4">
              <div className="border-b dark:border-gray-700 pb-2">
                <p className="font-medium tc2">New Book Added</p>
                <p className="text-sm tc3">2 hours ago</p>
              </div>
              <div className="border-b dark:border-gray-700 pb-2">
                <p className="font-medium tc2">Upcoming Event</p>
                <p className="text-sm tc3">1 day ago</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }