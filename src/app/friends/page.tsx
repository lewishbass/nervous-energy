export default function Friends() {
    const friends = [
      { name: 'Alice Johnson', status: 'Online', lastSeen: 'Now' },
      { name: 'Bob Smith', status: 'Offline', lastSeen: '2 hours ago' },
      { name: 'Carol White', status: 'Online', lastSeen: 'Now' },
    ];
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 tc1">Friends</h1>
        <div className="grid gap-4">
          {friends.map((friend, index) => (
            <div key={index} className="bg2 p-6 rounded-lg shadow flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 tc1">{friend.name}</h2>
                <p className="tc2">Last seen: {friend.lastSeen}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                friend.status === 'Online' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {friend.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }