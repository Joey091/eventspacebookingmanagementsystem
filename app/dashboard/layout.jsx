import UserMenu from "@/components/UserMenu";
import Siderbar from "@/components/dashboard/sidebar/Siderbar";



export const metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}){
  return (
    <div>
        
      <main className="w-full h-screen flex overflow-hidden">
        
        <Siderbar />
        {children}
      </main>
    </div>
  );
}