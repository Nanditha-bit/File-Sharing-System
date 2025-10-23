import { Card, CardContent } from "@/components/ui/card";

export const Requirements = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-2">
          <CardContent className="p-8 md:p-12">
            <div className="space-y-8">
              {/* Software Requirements */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Software Requirements:
                </h2>
                <ul className="space-y-4 text-lg text-foreground/90">
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>
                      <strong>Modern Web Browser:</strong> Chrome, Firefox, Safari, or Edge (latest version recommended)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>
                      <strong>Internet Connection:</strong> Stable broadband connection for file uploads and IPFS integration
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>
                      <strong>JavaScript Enabled:</strong> Required for application functionality
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>
                      <strong>Development (Optional):</strong> Node.js 18+ and npm for local development
                    </span>
                  </li>
                </ul>
              </div>

              {/* Hardware Requirements */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Hardware Requirements:
                </h2>
                <ul className="space-y-4 text-lg text-foreground/90">
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>
                      <strong>Device:</strong> Computer, tablet, or smartphone with at least 2GB RAM
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>
                      <strong>Storage:</strong> Minimum 100MB free space for browser cache and temporary files
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>
                      <strong>Display:</strong> Minimum 1024x768 screen resolution (responsive design supports all sizes)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>
                      <strong>Network:</strong> Minimum 1 Mbps download/upload speed for file transfers
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
