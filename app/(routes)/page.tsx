import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { BookOpenCheck, UsersRound, Waypoints } from "lucide-react";
import { CardSummary } from "./components/CardSummary";
import { LastCustomers } from "./components/LastCustomers";
import { Salesdistributor } from "./components/Salesdistributors";
import { TotalSuscribers } from "./components/TotalSuscribers";
import { ListIntegrations } from "./components/ListIntegrations";

const dataCardsSummary = [
  {
    icon: UsersRound,
    total: "12.450",
    average: 15,
    title: "Ordenes Creadas",
    tooltipText: "veras todas las ordenes creadas"
  },
  {
    icon: Waypoints,
    total: "50%",
    average: 80,
    title: "Ordenes Creadas 2.0",
    tooltipText: "See all the orders created"
  },
  {
    icon: BookOpenCheck,
    total: "363.959$",
    average: 30,
    title: "Ordenes Creadas 3.0",
    tooltipText: "See all the orders created"
  },

]

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl mb-4">Centro de Datos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">

        {dataCardsSummary.map(({ icon, total, average, title, tooltipText }) => (

          <CardSummary
            key={title}
            icon={icon}
            total={total}
            average={average}
            title={title}
            tooltipText={tooltipText}
          />
        ))}
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-x-10 mt-12">
        <LastCustomers />
        <Salesdistributor />
      </div>

      <div className="flex-col md:gap-x-10 xl:flex xl:flex-row gap-y-4 md:gap-y-0 mt-12 md:mb-10 justify-center">
        <TotalSuscribers />
        <ListIntegrations />

      </div>

    </div>








  );
}
