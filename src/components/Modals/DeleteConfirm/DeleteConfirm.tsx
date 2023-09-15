import React from "react";

// action creator
import MaterialActions from "@app/redux/actions/MaterialAction";

import styles from "./DeleteConfirm.module.scss";
import { Button, Modal } from "@app/compLibrary";
import CommonModalI from "./../commonTypes";
import { useAppDispatch } from "./../../../hooks/redux_hooks";
import { MaterialList } from "@app/api/Types/queryReturnTypes";
import { useNavigate } from "@tanstack/react-location";

interface DeleteConfirmInterface extends CommonModalI {
  translate: Function;
  material?: MaterialList;
  identityLabel: string;
}

const DeleteConfirm = (props: DeleteConfirmInterface) => {
  const { show, setShow, translate, material, identityLabel } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={show}
      className={styles.delModal}
      close={() => setShow(false)}
      header={<h2 style={{margin: 'auto'}}>{translate("delConfirmHeader")}</h2>}
    >
      <div>
        <p className={styles.bodyTxt}>{
            identityLabel === 'clearAll' ? translate("delConfirmContents") : identityLabel === 'deleteButton' ?  translate("delOrd") : translate("backTo")
          }</p>
        <div className={styles.buttonsWrap}>
        <Button
            color="grey"
            rounded
            onClick={() => {
              setShow(false);
            }}
          >
            {translate("cancel")}
          </Button>
          <Button
            color="theme"
            rounded
            onClick={() => {
              switch (identityLabel) {
                case 'clearAll':
                  dispatch(MaterialActions.clear())
                  break;
                case 'deleteButton':
                  if (material) {
                    dispatch(MaterialActions.removeMaterial(material));
                  }
                  break;
                case 'equalToOne':
                  if (material) {
                    dispatch(MaterialActions.removeMaterial(material));
                  }
                  break;
                case 'fromTopNavbar':
                  navigate({ to: '/orders' })
                  break;
                default:
                  break;
              }
              setShow(false);
            }}
          >
            {translate("confirm")}
          </Button>


        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;
