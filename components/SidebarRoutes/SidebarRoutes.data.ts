import { 
    BarChart4,
    Building2,
    PanelsTopLeft,
    Settings,
    ShieldCheck,
    CircleHelpIcon,
    Calendar,
    User,
    Circle,
    BookA,
    PenTool
} from "lucide-react";

export const dataGeneralSidebar = [
    {
        icon: PanelsTopLeft,
        label: "Inicio",
        href: "/"
    },
    {
        icon: Building2,
        label: "Ordenes",
        href: "/Orders"
    },
    /*
    {
        icon: Calendar,
        label: "Calendario",
        href: "/Tasks"
    },
    */
    {
        icon: User,
        label: "Usuarios",
        href: "/Users"
    },
    {
        icon: PenTool,
        label: "Instrumentos",
        href: "/Tools"
    },
    {
        icon: BookA,
        label: "Modos de Falla",
        href: "/ModosFalla"
    },

]

export const dataToolsSidebar = [
    {
        icon: CircleHelpIcon,
        label: "AMEF",
        href: "/AMEF"
    },
    {
        icon: BarChart4,
        label: "Analytics",
        href: "/Analytics"
    },
]

export const dataSupportSideBar = [
    {
        icon: Settings,
        label: "Settings",
        href: "/settings"
    },
    {
        icon: ShieldCheck,
        label: "Security",
        href: "/security"
    },
]

