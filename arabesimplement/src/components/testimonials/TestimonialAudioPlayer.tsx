export function TestimonialAudioPlayer({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <audio
      controls
      preload="none"
      className={className ?? "w-full"}
      src={src}
    >
      Votre navigateur ne lit pas l’audio.
    </audio>
  );
}
