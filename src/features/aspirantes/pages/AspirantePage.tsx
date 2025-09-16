import AspiranteFormularioBulma from "@/features/aspirantes/components/AspiranteFormularioBulma";

export default function AspirantesPage() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Inscripción de Aspirantes</h1>
        <AspiranteFormularioBulma
          isEnabled={true}
          onGuardado={(id) => console.log("Aspirante creado con id:", id)}
        />
      </div>
    </div>
  );
}
