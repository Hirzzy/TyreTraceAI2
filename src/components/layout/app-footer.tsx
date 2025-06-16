
import Link from 'next/link';
import { Cpu, ShieldCheck, FileText, Phone } from 'lucide-react';

export function AppFooter() {
    const services = [
        { icon: Cpu, title: "Analyse prédictive", description: "Anticipez les pannes et optimisez la maintenance." },
        { icon: ShieldCheck, title: "Données sécurisées", description: "Archivage à valeur probante pour vos garanties." },
        { icon: FileText, title: "Rapports automatisés", description: "Audits et dossiers SAV générés en un clic." },
        { icon: Phone, title: "Support technique", description: "Une équipe d'experts à votre écoute." },
    ];

    return (
        <footer className="bg-card text-card-foreground border-t border-border mt-auto">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
                    {services.map(service => (
                        <div key={service.title} className="flex flex-col items-center md:items-start p-4">
                            <div className="text-primary mb-3"><service.icon size={32} /></div>
                            <h3 className="font-bold text-lg mb-1 text-foreground">{service.title}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12 border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="text-muted-foreground">&copy; {new Date().getFullYear()} TyreTrace AI. Tous droits réservés.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="#" className="text-muted-foreground hover:text-primary">Conditions générales</Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary">Politique de confidentialité</Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
