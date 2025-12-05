export default function PageHeader({ text, subtext }) {
    return (
        <div className="text-center mb-4">
            <h1>{text}</h1>
            {subtext && <p className="text-muted">{subtext}</p>}
            <hr />
        </div>
    );
}
