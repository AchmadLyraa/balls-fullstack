import type { User } from "@/lib/server-auth";

const sections = [
  "Field & Time",
  "Payment",
  "Players",
  "Confirmation",
] as const;

interface HeaderProps {
  title: string;
  description: string;
  section: (typeof sections)[number];
  user: User;
}

export default function Header({
  title,
  description,
  section,
  user,
}: HeaderProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          {sections.map((currentSection, index) => (
            <div
              key={currentSection}
              className={`flex-1 border-b-2 pb-4 ${currentSection === section ? "border-red-600 text-red-600" : "border-gray-200"}`}
            >
              <div className="flex items-center">
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${currentSection === section ? "bg-red-600 text-white" : "bg-gray-200"}`}
                >
                  {index + 1}
                </div>
                <span>{currentSection}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
