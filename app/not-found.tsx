

export default function NotFound() {
    return (
        <div style={{ textAlign: "center", marginTop: "10vh" }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist or has been moved.</p>
            <a href="/admin" style={{ color: "#0070f3", textDecoration: "underline" }}>
                Go back to Admin Dashboard
            </a>
        </div>
    );
}