import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AllRoutes from "@/routes/AllRoutes";
import { Toaster } from "@/components/ui/toaster";

function App() {
    return (
        <div className="app-shell">
            <Header />
            <main style={{ flex: 1 }}>
                <AllRoutes />
            </main>
            <Footer />
            <Toaster />
        </div>
    );
}

export default App;