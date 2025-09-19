import './loading.css';
export default function Loading() {
  return (
    <div className="display-flex flex-column align-items-center justify-content-center" style={{height: '100vh' , width: '100vw', backgroundColor: '#f0f0f0'}}>
      <div className="loading-spinner"></div>
      <p className="text-black">Loading...</p>
    </div>
  );
}
