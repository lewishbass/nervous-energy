export default function Books() {
    const books = [
      { title: 'The Great Adventure', author: 'John Doe', genre: 'Fiction' },
      { title: 'Digital Age', author: 'Jane Smith', genre: 'Technology' },
      { title: 'Cooking Basics', author: 'Chef Mike', genre: 'Cooking' },
    ];
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 tc1">Books</h1>
        <div className="grid gap-4">
          {books.map((book, index) => (
            <div key={index} className="bg2 dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2 tc1">{book.title}</h2>
              <p className="tc2">By {book.author}</p>
              <p className="tc3">{book.genre}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }