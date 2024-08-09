import { forwardRef } from "react";
import { Icon } from "@iconify/react";

import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const Iconify = forwardRef(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
  />
));

export default Iconify;