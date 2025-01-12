import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Image
        className="animate-pulse"
        src="/images/logo.png"
        alt="logo"
        height={140}
        width={180}
        priority
      />
    </div>
  );
}
