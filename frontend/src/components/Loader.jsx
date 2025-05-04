import "./Loader.css"; 
import "../App.css"

const Loader = () => {
    return (
        <div className="neon-mist1 loader-container flex flex-col items-center justify-center">
            <div className="loader-logo">
                <img src="https://res.cloudinary.com/djoebsejh/image/upload/v1746277693/Pharos/b4l4e8yqnyde0p4tbs6r.png" alt="Logo" />
            </div>
            <div className="loader-progress">
                <div className="loader-progress-bar"></div>
            </div>
        </div>
    );
};

export default Loader;
