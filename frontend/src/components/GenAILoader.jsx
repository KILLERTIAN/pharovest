import './GenAiLoader.css';

export const GenAILoader = () => {
    return (
        <div className="genai-loader-container overflow-hidden">
            <div className="genai-loader-spinner">
                <div className="genai-loader-logo">
                    <img src="https://res.cloudinary.com/djoebsejh/image/upload/v1746277693/Pharos/b4l4e8yqnyde0p4tbs6r.png" alt="Gemini Logo" />
                </div>
                <div className="genai-spinner"></div>
            </div>
        </div>
    );
};
