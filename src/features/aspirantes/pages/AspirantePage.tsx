import AspiranteFormularioBulma from "@/features/aspirantes/components/AspiranteFormularioBulma";
import logo from '@/assets/Logo-img.png'

export default function AspirantesPage() {
  
  return (
    <section className="section users-scope">
      <div className="container ">
        <figure className="image is-64x64">
          <img src={logo} alt="logo" className='m-2' />
        </figure>
        <h1 className="title has-text-black">Aspirantes</h1>
        <p className="subtitle has-text-black">Complete los pasos del formulario</p>
        <article className="message is-info mb-1">
          <div className="message-body has-text-black has-background-white">
            <i className="fa-solid fa-circle-info mr-1"></i>
            Con el fin de avanzar en el proceso de inscripción, les solicitamos diligenciar con especial cuidado el formulario de registro de aspirantes, <strong>verificando que la información ingresada sea correcta y completa. </strong>  

            Una vez finalizado este paso, deberán presentarse en la Secretaría del colegio para entregar la documentación física faltante.

            La inscripción se considerará completa únicamente cuando la Secretaría haya <strong>recibido y validado dichos documentos. </strong>

            Agradecemos su atención y colaboración en este proceso.
            </div>
        </article>
        <AspiranteFormularioBulma/>
      </div>
      </section>
  );
}

/*  <div>
     <h1 className="title mb-1 has-text-black">Inscripción de Aspirantes</h1>
     <p className="subtitle is-6 has-text-primary-invert">Formulario de registro para nuevos aspirantes Colina Campestre</p>
     <section className="section users-scope">

     <AspiranteFormularioBulma
       isEnabled={true}
       onGuardado={(id) => console.log("Aspirante creado con id:", id)}
     />
     </section>
   </div> */