import React, { useState, useEffect, useCallback } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import Button from '../../../components/Button';

import { useToast } from '../../../context/ToastContext';

import DebitList from '../List';

import { Header, DebitContainer, DebitDetailModal } from './styles';

import { api } from '../../../services/api';

interface Debit {
  client_id: number;
  client_name: string;
  total_debits: number;
}

interface ClientIdParam {
  client_id: string;
}

const ViewDebitDetail: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { params } = useRouteMatch<ClientIdParam>();

  const { addToast } = useToast();
  const [debitDetail, setDebitDetail] = useState<Debit[]>([]);

  const history = useHistory();

  const route = 'viewDebitDetail';

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  // This function get all debits grouped by client_id, client_name with sum of amount
  const getDebitDetail = useCallback(async () => {
    try {
      api
        .get('/debits', {
          params: { client_id: params.client_id },
        })
        .then((response) => {
          const data = response.data.map((d: Debit[]) => ({
            ...d,
          }));

          setDebitDetail(data);
        });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao carregar Dívidas!',
        description:
          'Ocorreu um erro durante o carregamento das dívidas. Verifique sua conexão com o banco de dados',
      });
    }
  }, [params.client_id, addToast]);

  useEffect(() => {
    getDebitDetail();
  }, [getDebitDetail]);

  const handleClientDelition = useCallback(async () => {
    try {
      await api.delete('/debits/0', {
        params: {
          client_id: params.client_id,
        },
      });

      addToast({
        type: 'success',
        title: 'Exclusão de cliente!',
        description: 'O cliente e seus débitos foram excluídos com sucesso.',
      });

      setTimeout(() => {
        history.push('/');
      }, 3000);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro durante exclusão de cliente!',
        description:
          'Ocorreu um erro durante a exclusão do cliente, por favor verifique sua conexão com o banco de dados.',
      });
    }
  }, [addToast, history, params.client_id]);

  return (
    <>
      <Header>
        <h1>Detalhes das Dívidas</h1>
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </Header>

      {modalIsOpen && (
        <DebitDetailModal>
          <h3>Confirma a exclusão do cliente?</h3>
          <main>
            <Button type="button" onClick={handleClientDelition}>
              Excluir
            </Button>
            <Button type="button" onClick={closeModal}>
              Fechar
            </Button>
          </main>
        </DebitDetailModal>
      )}

      <DebitContainer>
        <div className="buttons">
          <Button
            type="button"
            onClick={() =>
              history.push(`/addDebit/${route}/${params.client_id}`)
            }
          >
            Nova Dívida
          </Button>
          <Button type="button" onClick={openModal}>
            Excluir Cliente
          </Button>
        </div>
        {debitDetail.map((debit, index) => (
          <div className="head" key={index}>
            <div className="category">
              <span>Cliente </span>
              <p>{debit.client_name}</p>
            </div>

            <div className="creationDate">
              <span>Total da Dívida</span>
              <p>R$ {debit.total_debits}</p>
            </div>
          </div>
        ))}
      </DebitContainer>

      <DebitList client_id={params.client_id} />
    </>
  );
};

export default ViewDebitDetail;
