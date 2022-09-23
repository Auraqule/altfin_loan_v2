import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useNavigate } from "react-router-dom";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Modal({ loanType, active, setIsModalActive }: any) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsModalActive(false);
  };

  const handleProceedWithLoan = () => {
    handleClose();
    navigate("/register");
  };

  React.useEffect(() => {
    if (active) {
      handleClickOpen();
    }
  }, [loanType, active]);

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ fontFamily: "roboto", fontWeight: "bold" }}>
          {"Are you sure you want to proceed with this loan?"}
        </DialogTitle>
        <DialogContent>
          <div id="alert-dialog-slide-description">
            <p className="pb-1">{loanType.loanType}</p>
            <div className="flex justify-between px-8 mb-3 bg-blue">
              <p className="py-2 text-white">Loan Interest: 15%</p>
              <p className="py-2 text-white">Loan Duration: X-Days</p>
            </div>
            Altfin loans is highly committed to giving you the fastest and
            seamless loan request processing. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Itaque voluptates cumque voluptatibus
            delectus consequuntur ex libero! Nulla nam commodi animi doloribus
            enim architecto numquam exercitationem consequatur id. Neque, cum
            adipisci? Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Distinctio id fugit odit consequuntur reprehenderit porro harum
            voluptate nisi voluptatem dignissimos odio, nulla deleniti
            voluptatibus, itaque at! Sunt alias dolorem iure!
          </div>
        </DialogContent>
        <DialogActions>
          <Button style={{}} onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleProceedWithLoan}>Proceed</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
