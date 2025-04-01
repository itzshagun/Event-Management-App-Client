import { useState } from "react"

import MenuItems from "./menu-items"
import { AlignJustify } from "lucide-react"
import { Drawer } from "antd"

const Sidebar = () => {

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div>
      <div className="lg:flex hidden h-full lg:w-60">
      <MenuItems />
      </div>
      <div className="bg-[#192BC2]  !p-5 lg:hidden flex">
        <AlignJustify 
          size={20} 
          color="white"
          onClick={()=> setShowMobileMenu(!showMobileMenu)} 
          className="cursor-pointer" 
        />
      </div>

    {showMobileMenu && (
      <Drawer open={showMobileMenu} placement="left" onClose={() => setShowMobileMenu(false)}>
        <MenuItems />
      </Drawer>
    )}

    </div>
  )
}

export default Sidebar
