import './style.css'
import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switch from '@/components/ui/Switch'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import EmailModal from '@/features/users/components/EmailModal'
import { useAuth } from '@/context/AuthContext'

const initialUsersExample = [
	{ id: 1, name: 'Ada Lovelace', email: 'ada@example.com', is_active: true },
	{ id: 2, name: 'Grace Hopper', email: 'grace@example.com', is_active: true },
	{ id: 3, name: 'Margaret Hamilton', email: 'margaret@example.com', is_active: false },
	{ id: 4, name: 'Joan Clarke', email: 'joan@example.com', is_active: true },
]

type User = {
	id: number
	name: string
	email: string
	is_active: boolean
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
	onDelete: (id: number) => void
}) {
	if (!user) return null

	const handleEdit = () => {
		onEdit(user)
		onClose()
	}

	const handleEmail = () => {
		onEmail(user)
		onClose()
	}

	const handleDelete = () => {
		onDelete(user.id)
		onClose()
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
	const [q, setQ] = useState('')
	const [editingUser, setEditingUser] = useState<User | null>(null)
	const [isCreating, setIsCreating] = useState(false)
	const [userToEmail, setUserToEmail] = useState<User | null>(null)
	const [actionUser, setActionUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const { logout } = useAuth()

	useEffect(() => {
		setIsLoading(true)
		setTimeout(() => {
			setUsers(initialUsersExample)
			setIsLoading(false)
		}, 800)
	}, [])

	const handleCreateUser = (data: { name: string; email: string; is_active: boolean }) => {
		const newUser = { ...data, id: Date.now() }
		setUsers(currentUsers => [newUser, ...currentUsers])
	}

	const handleUpdateUser = (id: number, data: Partial<Omit<User, 'id'>>) => {
		setUsers(currentUsers => currentUsers.map(u => (u.id === id ? { ...u, ...data } : u)))
	}

	const handleDeleteUser = (id: number) => {
		setUsers(currentUsers => currentUsers.filter(u => u.id !== id))
	}

	const filteredUsers = users.filter(
		u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
	)

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
					<Input placeholder="Buscar por nome ou email" value={q} onChange={e => setQ(e.target.value)} style={{ minWidth: 280 }} />
					<div className="space" />
					<Button onClick={openCreateModal}>Novo Usuário</Button>
				</div>

				<div style={{ padding: 12 }}>
					{isLoading ? (
						<div style={{ display: 'grid', placeItems: 'center', padding: 20 }}><Spinner size={22} /></div>
					) : !filteredUsers.length ? (
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
										<th className="sticky-col" style={{ width: 50 }}></th>
									</tr>
								</thead>
								<tbody>
									{filteredUsers.map(u => (
										<tr key={u.id}>
											<td>{u.id}</td>
											<td>{u.name}</td>
											<td>{u.email}</td>
											<td>
												<span className={"tag " + (u.is_active ? 'green' : 'gray')}>{u.is_active ? 'Ativo' : 'Inativo'}</span>
											</td>
											<td className="sticky-col">
												<Button className="ghost" onClick={() => openActionsModal(u)}>...</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					<div className="row" style={{ justifyContent: 'flex-end', paddingTop: 12 }}>
						<Button className="ghost" disabled>Anterior</Button>
						<div style={{ color: 'var(--muted)' }}>Página 1 de 1</div>
						<Button className="ghost" disabled>Próxima</Button>
					</div>
				</div>
			</div>

			<UserFormModal
				open={isCreating || editingUser !== null}
				onClose={closeSubModal}
				user={editingUser}
				onCreate={handleCreateUser}
				onUpdate={handleUpdateUser}
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

function UserFormModal({ open, onClose, user, onCreate, onUpdate }: {
	open: boolean
	onClose: () => void
	user: User | null
	onCreate: (data: { name: string; email: string; is_active: boolean }) => void
	onUpdate: (id: number, data: Partial<Omit<User, 'id'>>) => void
}) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [isActive, setIsActive] = useState(true)

	useEffect(() => {
		if (user) {
			setName(user.name)
			setEmail(user.email)
			setIsActive(user.is_active)
		} else {
			setName('')
			setEmail('')
			setIsActive(true)
		}
	}, [user, open])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (user) {
			onUpdate(user.id, { name, email, is_active: isActive })
		} else {
			onCreate({ name, email, is_active: isActive })
		}
		onClose()
	}

	return (
		<Modal open={open} onClose={onClose} title={user ? 'Editar Usuário' : 'Novo Usuário'}>
			<form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
				<Input label="Nome" value={name} onChange={e => setName(e.target.value)} required />
				<Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
				<div className="row"><span>Status</span><Switch checked={isActive} onChange={setIsActive} /></div>
				<div className="row" style={{ justifyContent: 'flex-end' }}>
					<Button className="ghost" type="button" onClick={onClose}>Cancelar</Button>
					<Button type="submit">Salvar</Button>
				</div>
			</form>
		</Modal>
	)
}
