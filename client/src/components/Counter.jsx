function Counter({ count, onIncrement }) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('https://kcvi-gp.s3.eu-north-1.amazonaws.com/kc-bg.png')",
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-8">{count}</div>
          <button
            onClick={onIncrement}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200"
          >
            Add 1
          </button>
        </div>
      </div>
    )
  }
  
export default Counter