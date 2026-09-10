import registerLoginImage from '../../../assets/source-Image/Register_Login.jpg';

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={registerLoginImage}
          alt="Model holding a light stick while sitting next to collectible vinyl records"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/30 to-black/60" />
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}