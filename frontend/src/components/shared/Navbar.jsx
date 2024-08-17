import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = false;
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold text-[#008000]">
            Portal<span className="text-[#008000]">_Trabalho</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            <li>Empresas</li>
            <li>Trabalhos</li>
            <li>Home</li>
            <li>Pesquisas</li>
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>{" "}
              </Link>
              <Link to="/login">
                <Button className="bg-[#275470] hover:bg-[#79a1ba]">
                  Cadastrar
                </Button>{" "}
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <div className="flex gap-2 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
                        alt="@shadcn"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Admininstrador</h4>
                      <p className="text-sm text-muted-foreground">
                        Seja bem vindo
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link"> Perfil</Button>
                    </div>

                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut />
                      <Button variant="link">Sair</Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
