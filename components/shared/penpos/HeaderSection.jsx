export default function HeaderSection({ posName }) {
    return (
        <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
                {posName}
            </h1>
            <p className="text-zinc-400">Masukkan hasil permainan tim</p>
        </div>
    );
}
