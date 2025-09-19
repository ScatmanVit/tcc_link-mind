import './style.css'

import listUsers from '@/services/admin/admin.listUsers'
import createUser from '@/services/admin/admin.createUser'
import deleteUser from '@/services/admin/admin.deleteUser'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switch from '@/components/ui/Switch'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import EmailModal from '@/components/EmailModal'
import { useAuth } from '@/context/AuthContext'

export type User = {
	id: string
	name: string
	email: string,
	password?: string,
	is_active: boolean,
	role: string,
	status?: boolean
}

function ActionsModal({
	user,
	onClose,
	onEdit,
	onEmail,
	onDelete,
}: {
	user: User | null
	onClose: () => void
	onEdit: (user: User) => void
	onEmail: (user: User) => void
	onDelete: (id: string) => void
}) {
	const { access_token } = useAuth()

	if (!user) return null

	const handleEdit = () => {
		onEdit(user)
		onClose()
	}

	const handleEmail = () => {
		onEmail(user)
		onClose()
	}

	async function handleDelete() {
		if (!access_token || !user?.id) {
			console.log("Sem token ou ID para usar")
			return null
		}
		try {
			const response = await deleteUser(access_token, user.id);
			if (response) {
				onClose()
				setTimeout(() => {
					onDelete(user.id)
				}, 500)
				console.log("Usuário deletado:", response);
			}
		
		} catch (err: any) {
			console.error(err.message || "Deu erro ao deletar")
		}
	}



	return (
		<Modal open={!!user} onClose={onClose} title={`Ações para ${user.name}`}>
			<div className="actions-modal-body">
				<Button onClick={handleEdit} className="full-width">Editar Usuário</Button>
				<Button onClick={handleEmail} className="full-width ghost">Enviar Email</Button>
				<Button onClick={handleDelete} className="full-width danger">Excluir Usuário</Button>
			</div>
		</Modal>
	)
}

export default function UsersPage() {

	const [users, setUsers] = useState<User[]>([])
	const [user, setUser] = useState({})
	const [q, setQ] = useState('')
	const [editingUser, setEditingUser] = useState<User | null>(null)
	const [isCreating, setIsCreating] = useState(false)
	const [userToEmail, setUserToEmail] = useState<User | null>(null)
	const [actionUser, setActionUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | undefined>()
	const { logout, access_token } = useAuth()
	const [searchParams, setSearchParams] = useSearchParams();

	const page = searchParams.get("page") || "1";
	const limit = searchParams.get("limit") || "25";
	useEffect(() => {
		setIsLoading(true);

		async function fetchUsers() {
			if (!access_token) {
				setError("Token não encontrado. Faça login novamente.");
				return;
			}
			try {
				const data = await listUsers(page, limit, access_token);
				setUsers(data.users);
			} catch (err: any) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUsers();
	}, [searchParams]);

	function handleNextPage() {

		setSearchParams({
			page: (Number(page) + 1).toString(), limit
		});
	};

	function handlePreviusPage() {
		setSearchParams({
			page: (Number(page) - 1).toString(), limit
		})
	}

	function handleDeleteUser(id: string) {
		setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
	}

	async function handleUpdateUser() {

	}


	const openCreateModal = () => setIsCreating(true)
	const openEditModal = (user: User) => setEditingUser(user)
	const openEmailModal = (user: User) => setUserToEmail(user)
	const openActionsModal = (user: User) => setActionUser(user)

	const closeSubModal = () => {
		setIsCreating(false)
		setEditingUser(null)
		setUserToEmail(null)
	}

	return (
		<div className="container">
			<div className="card">
				<div className="page-header">
					<div className="row">
						<div className="brand">ERP Veloz</div>
						<div className="space" />
						<Button className="ghost" onClick={logout}>Sair</Button>
					</div>
				</div>
				<div className="toolbar">
					<Input
						placeholder="Buscar por nome ou email"
						value={q}
						onChange={e => setQ(e.target.value)}
						style={{ minWidth: 280 }}
					/>
					<div className="space" />
					<Button onClick={openCreateModal}>Novo Usuário</Button>
				</div>

				<div style={{ padding: 12 }}>
					{isLoading ? (
						<div style={{ display: 'grid', placeItems: 'center', padding: 20 }}><Spinner size={22} /></div>
					) : !users.length ? (
						<div className="tag gray" style={{ margin: 20 }}>Nenhum usuário encontrado</div>
					) : (
						<div className="table-wrapper">
							<table className="table" role="grid">
								<thead>
									<tr>
										<th>ID</th>
										<th>Nome</th>
										<th>Email</th>
										<th>Status</th>
										<th>Role</th>
										<th className="sticky-col" style={{ width: 50 }}></th>
									</tr>
								</thead>
								<tbody>
									{users.map(user => (
										<tr key={user.id}>
											<td>{user.id}</td>
											<td>{user.name}</td>
											<td>{user.email}</td>
											<td>{user.role}</td>
											<td>
												<span className={"tag " +
													(user.is_active ? 'green' : 'gray')}>{user.is_active ? 'Ativo' : 'Inativo'}
												</span>
											</td>
											<td className="sticky-col">
												<Button
													className="ghost"
													onClick={() => openActionsModal(user)}>...</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					<div className="row" style={{ justifyContent: 'center', paddingTop: 25 }}>
						<Button className="ghost" onClick={handlePreviusPage}>
							⬅
						</Button>
						<div style={{ color: 'var(--muted)' }}>
							Página {page}
						</div>
						<Button className="ghost" onClick={handleNextPage}>
							➡
						</Button>
					</div>
				</div>
			</div>

			<UserFormModal
				open={isCreating || editingUser !== null}
				onClose={closeSubModal}
				user={editingUser}
			/>
			<EmailModal open={userToEmail !== null} user={userToEmail} onClose={closeSubModal} />
			<ActionsModal
				user={actionUser}
				onClose={() => setActionUser(null)}
				onEdit={openEditModal}
				onEmail={openEmailModal}
				onDelete={handleDeleteUser}
			/>
		</div>
	)
}

function UserFormModal({ open, onClose, user }: {
	open: boolean
	onClose: () => void
	user: User | null
}) {
	const { access_token } = useAuth();

	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const roleRef = useRef<HTMLSelectElement>(null);
	const [isStatus, setIsStatus] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (!access_token) {
			setError("Token não encontrado. Faça login novamente.");
			return;
		}

		if (!emailRef.current ||
			!nameRef.current ||
			!passwordRef.current ||
			!roleRef.current) {
			setError("Por favor preencha todos os campos necessários");
			return;
		}

		const dataUser = {
			name: nameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
			role: roleRef.current.value,
			status: isStatus
		};

		try {
			if (user) {
				// Edição
				// await onUpdate(user.id, dataUser);
			} else {
				const newUser = await createUser(dataUser, access_token);
				if (!!newUser) {
					console.log("Usuário criado ou alterado corretamente")
				}
			}
			setError("");
			onClose();
		} catch (err: any) {
			setError(err.message || "Erro ao salvar usuário");
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={user ? 'Editar Usuário' : 'Novo Usuário'}>
			<form style={{ display: 'grid', gap: 12 }}>
				<Input
					label="Nome"
					ref={nameRef}
					required
				/>
				<Input
					label="Email"
					type="email"
					ref={emailRef}
					required
				/>
				<Input
					label="Senha"
					type="password"
					ref={passwordRef}
					required
				/>
				<div className="row">
					<span>
						Status
					</span>
					<select
						value={isStatus ? "true" : "false"}
						onChange={(e) => setIsStatus(e.target.value === "true")}
					>
						<option value="true">Ativo</option>
						<option value="false">Inativo</option>
					</select>
				</div>
				<div>
					<select ref={roleRef}>
						<option value="ADMIN">ADMIN</option>
						<option value="USER">USER</option>
					</select>
				</div>
				<div
					className="row"
					style={{ justifyContent: 'flex-end' }}
				>
					<Button
						className="ghost"
						type="button"
						onClick={onClose}
					>
						Cancelar
					</Button>
					<Button type="button" onClick={handleSubmit}>
						Salvar
					</Button>
					{error && <p style={{ color: "red" }}>{error}</p>}
				</div>
			</form>
		</Modal>
	)
}
