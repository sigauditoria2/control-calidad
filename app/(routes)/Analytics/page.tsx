export default function Analytics() {
    return (
        <div className="h-full w-full p-6">
            <h1 className="text-2xl font-bold mb-4">Análisis y Reportes</h1>
            <div className="w-full h-[calc(100vh-150px)] rounded-lg overflow-hidden shadow-lg">
                <iframe 
                    src="https://app.powerbi.com/view?r=eyJrIjoiNmMwMDM5ZTQtNTFkYi00YTQzLWE5NDUtNjdkNmI5M2NmNGUzIiwidCI6IjNjZWM5MjY0LTVjMWMtNDI5ZS04ODc3LWMyM2Q3MDExMzlhYyIsImMiOjR9"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    allowFullScreen
                />
            </div>
        </div>
    );
}