import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, DatePicker, Row, Col, Divider, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

const ProjectModal = ({ open, onCancel, onSave, project, loading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (project) {
                form.setFieldsValue({
                    ...project,
                    startDate: project.startDate ? dayjs(project.startDate, 'DD MMM YYYY') : null,
                    endDate: project.endDate ? dayjs(project.endDate, 'DD MMM YYYY') : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [project, form, open]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const formatted = {
                ...values,
                startDate: values.startDate ? values.startDate.format('DD MMM YYYY') : null,
                endDate: values.endDate ? values.endDate.format('DD MMM YYYY') : null,
            };
            onSave(formatted);
        });
    };

    return (
        <Modal
            title={project ? 'Edit Proyek' : 'Tambah Proyek Baru'}
            open={open}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={800}
            okText="Simpan"
            cancelText="Batal"
            destroyOnClose
            styles={{ body: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 } }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    progress: 0,
                    target: 0,
                    budgetUsed: 0,
                    budgetTotal: 0,
                    startMonth: 0,
                    duration: 1,
                    status: 'Berjalan',
                    priority: 'Sedang',
                    issues: [],
                    timelineEvents: [],
                    team: [],
                    hse: { manHours: 0, safeHours: 0, incidents: 0, fatality: 0 },
                    documents: [],
                    gallery: [],
                }}
                size="small"
            >
                {/* ===== INFORMASI DASAR ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-0 !mb-3">Informasi Dasar</Divider>

                <Row gutter={12}>
                    <Col span={5}>
                        <Form.Item name="id" label="Kode Project" rules={[{ required: true, message: 'Wajib diisi' }]}>
                            <Input disabled={!!project} placeholder="EXP-101" />
                        </Form.Item>
                    </Col>
                    <Col span={19}>
                        <Form.Item name="name" label="Nama Proyek" rules={[{ required: true, message: 'Wajib diisi' }]}>
                            <Input placeholder="Nama lengkap proyek" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={6}>
                        <Form.Item name="category" label="Kategori" rules={[{ required: true }]}>
                            <Select placeholder="Pilih" options={[
                                { label: 'Exploration', value: 'Exploration' },
                                { label: 'Drilling', value: 'Drilling' },
                                { label: 'Operation', value: 'Operation' },
                                { label: 'Facility', value: 'Facility' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="status" label="Status">
                            <Select options={[
                                { label: 'Berjalan', value: 'Berjalan' },
                                { label: 'Tertunda', value: 'Tertunda' },
                                { label: 'Kritis', value: 'Kritis' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="priority" label="Prioritas">
                            <Select options={[
                                { label: 'Rendah', value: 'Rendah' },
                                { label: 'Sedang', value: 'Sedang' },
                                { label: 'Tinggi', value: 'Tinggi' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="location" label="Lokasi">
                            <Select placeholder="Pilih" options={[
                                { label: 'Blok Langsa', value: 'Blok Langsa' },
                                { label: 'Blok Malacca Strait', value: 'Blok Malacca Strait' },
                                { label: 'Blok Bentu', value: 'Blok Bentu' },
                                { label: 'Blok Korinci Baru', value: 'Blok Korinci Baru' },
                                { label: 'Blok Singa', value: 'Blok Singa' },
                                { label: 'Blok Kangean', value: 'Blok Kangean' },
                                { label: 'Blok Gebang', value: 'Blok Gebang' },
                                { label: 'Kantor Pusat Jakarta', value: 'Kantor Pusat Jakarta' },
                            ]} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== PENANGGUNG JAWAB ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-1 !mb-3">Penanggung Jawab</Divider>

                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item name="sponsor" label="Sponsor">
                            <Input placeholder="Contoh: SKK Migas" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="manager" label="Manajer Proyek">
                            <Input placeholder="Nama manager" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="strategy" label="Strategi">
                            <Input placeholder="Contoh: Fast Track" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== TIMELINE ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-1 !mb-3">Timeline</Divider>

                <Row gutter={12}>
                    <Col span={6}>
                        <Form.Item name="startDate" label="Tanggal Mulai">
                            <DatePicker className="w-full" format="DD MMM YYYY" placeholder="Pilih" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="endDate" label="Tanggal Selesai">
                            <DatePicker className="w-full" format="DD MMM YYYY" placeholder="Pilih" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="startMonth" label="Bulan Mulai">
                            <Select options={[
                                'Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'
                            ].map((m, i) => ({ label: m, value: i }))} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="duration" label="Durasi (bulan)">
                            <InputNumber min={1} max={24} className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== PROGRESS & BUDGET ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-1 !mb-3">Progress & Budget</Divider>

                <Row gutter={12}>
                    <Col span={4}>
                        <Form.Item name="progress" label="Progress (%)">
                            <InputNumber min={0} max={100} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="target" label="Target (%)">
                            <InputNumber min={0} max={100} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="budgetUsed" label="Budget Used (%)">
                            <InputNumber min={0} max={100} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="budgetTotal" label="Total Budget (IDR)">
                            <InputNumber
                                className="w-full"
                                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== KENDALA / ISU ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-1 !mb-3">Kendala & Isu</Divider>

                <Form.List name="issues">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="flex items-center gap-2 mb-2">
                                    <Form.Item {...restField} name={name} className="!mb-0 flex-1">
                                        <Input placeholder="Deskripsi isu..." />
                                    </Form.Item>
                                    <MinusCircleOutlined className="text-red-400 cursor-pointer" onClick={() => remove(name)} />
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small" className="w-full">
                                Tambah Isu
                            </Button>
                        </>
                    )}
                </Form.List>

                {/* ===== TIMELINE EVENTS ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-4 !mb-3">Timeline Events / Milestone</Divider>

                <Form.List name="timelineEvents">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={8} className="mb-2" align="middle">
                                    <Col span={5}>
                                        <Form.Item {...restField} name={[name, 'date']} className="!mb-0">
                                            <Input placeholder="Tanggal" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item {...restField} name={[name, 'title']} className="!mb-0">
                                            <Input placeholder="Judul milestone" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item {...restField} name={[name, 'status']} className="!mb-0">
                                            <Select placeholder="Status" options={[
                                                { label: 'Selesai', value: 'finish' },
                                                { label: 'Proses', value: 'process' },
                                                { label: 'Error', value: 'error' },
                                                { label: 'Menunggu', value: 'wait' },
                                            ]} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item {...restField} name={[name, 'description']} className="!mb-0">
                                            <Input placeholder="Keterangan" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                        <MinusCircleOutlined className="text-red-400 cursor-pointer" onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small" className="w-full">
                                Tambah Milestone
                            </Button>
                        </>
                    )}
                </Form.List>

                {/* ===== TIM PROYEK ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-4 !mb-3">Tim Proyek</Divider>

                <Form.List name="team">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={8} className="mb-2" align="middle">
                                    <Col span={11}>
                                        <Form.Item {...restField} name={[name, 'name']} className="!mb-0">
                                            <Input placeholder="Nama anggota" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item {...restField} name={[name, 'role']} className="!mb-0">
                                            <Input placeholder="Jabatan / Role" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <MinusCircleOutlined className="text-red-400 cursor-pointer" onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small" className="w-full">
                                Tambah Anggota
                            </Button>
                        </>
                    )}
                </Form.List>

                {/* ===== HSE (K3) ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-4 !mb-3">Statistik HSE (K3)</Divider>

                <Row gutter={12}>
                    <Col span={6}>
                        <Form.Item name={['hse', 'manHours']} label="Total Man Hours">
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name={['hse', 'safeHours']} label="Safe Man Hours">
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name={['hse', 'incidents']} label="Incidents">
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name={['hse', 'fatality']} label="Fatality">
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== DOKUMEN ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-1 !mb-3">Dokumen Proyek</Divider>

                <Form.List name="documents">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={8} className="mb-2" align="middle">
                                    <Col span={8}>
                                        <Form.Item {...restField} name={[name, 'name']} className="!mb-0">
                                            <Input placeholder="Nama file" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item {...restField} name={[name, 'type']} className="!mb-0">
                                            <Select placeholder="Tipe" options={[
                                                { label: 'PDF', value: 'PDF' },
                                                { label: 'Excel', value: 'Excel' },
                                                { label: 'Word', value: 'Word' },
                                                { label: 'Image', value: 'Image' },
                                            ]} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item {...restField} name={[name, 'date']} className="!mb-0">
                                            <Input placeholder="Tanggal" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item {...restField} name={[name, 'size']} className="!mb-0">
                                            <Input placeholder="Ukuran" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                        <MinusCircleOutlined className="text-red-400 cursor-pointer" onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small" className="w-full">
                                Tambah Dokumen
                            </Button>
                        </>
                    )}
                </Form.List>

                {/* ===== GALERI ===== */}
                <Divider orientation="left" className="!text-xs !text-gray-500 !font-semibold !mt-4 !mb-3">Galeri Foto</Divider>

                <Form.List name="gallery">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={8} className="mb-2" align="middle">
                                    <Col span={10}>
                                        <Form.Item {...restField} name={[name, 'url']} className="!mb-0">
                                            <Input placeholder="URL gambar" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item {...restField} name={[name, 'caption']} className="!mb-0">
                                            <Input placeholder="Caption" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item {...restField} name={[name, 'date']} className="!mb-0">
                                            <Input placeholder="Tanggal" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <MinusCircleOutlined className="text-red-400 cursor-pointer" onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small" className="w-full">
                                Tambah Foto
                            </Button>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default ProjectModal;
