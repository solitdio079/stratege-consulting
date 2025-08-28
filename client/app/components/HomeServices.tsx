import { Link } from "react-router";
const valeurs = [
  {
    content: <p>Assistance à la création d’entreprise</p>,
    icon: "icon-[material-symbols--enterprise]",
    bgColor: "bg-primary",
  },
  {
    content: <p>Consultation & Diagnostic fiscal</p>,
    icon: "icon-[material-symbols--diagnosis]",
    bgColor: "bg-primary",
  },
  {
    content: <p>Conseil en stratégie et leadership</p>,
    icon: "icon-[material-symbols--social-leaderboard]",
    bgColor: "bg-red-500",
  },
];

export default function HomeServices() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid gap-6 md:grid-cols-3 border-primary section">
        {valeurs.map((item) => (
          <div className="flex flex-col">
            <div
              className={`bg-primary rounded-full text-white intersect:motion-preset-slide-right intersect:motion-delay-[100ms] intersect:motion-ease-spring-bouncier z-2 w-fit icon-container p-10 -mb-5 mx-auto`}
            >
              <span className={`${item.icon} size-12 rtl:rotate-180`}></span>
            </div>

            <div
              className={`flex bg-primary text-white intersect:motion-preset-slide-left intersect:motion-delay-[300ms] intersect:motion-ease-spring-bouncier text-2xl font-bold flex-col card items-center p-10 text-center justify-between card-border`}
            >
              {item.content}
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/services"
        className="btn btn-primary animate-bounce btn-gradient btn-lg intersect:motion-preset-slide-right intersect:motion-delay-[800ms] intersect:motion-ease-spring-bouncie"
      >
        Plus de servies{" "}
        <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
      </Link>
    </div>
  );
}
